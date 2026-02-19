'use client'

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type UserRole = 'superadmin' | 'admin'

interface AuthUser {
    id: string
    email: string
    role: UserRole
    fullName: string
}

interface AuthContextType {
    user: AuthUser | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, fullName: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
})

let _supabase: ReturnType<typeof createClient> | null = null
function getSupabase() {
    if (!_supabase) _supabase = createClient()
    return _supabase
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = getSupabase()

    const initialized = useRef(false)
    const signingOut = useRef(false)

    const loadUserProfile = useCallback(async (authUser: User) => {
        if (signingOut.current) return

        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (signingOut.current) return

            setUser({
                id: authUser.id,
                email: authUser.email || '',
                role: profile?.role || 'admin',
                fullName: profile?.full_name || authUser.email?.split('@')[0] || 'User',
            })
        } catch {
            if (signingOut.current) return

            setUser({
                id: authUser.id,
                email: authUser.email || '',
                role: 'admin',
                fullName: authUser.email?.split('@')[0] || 'User',
            })
        } finally {
            setLoading(false)
        }
    }, [supabase])

    const handleSignIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    }, [supabase])

    const handleSignUp = useCallback(async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        })
        if (error) throw error
    }, [supabase])

    const handleSignOut = useCallback(async () => {
        if (signingOut.current) return
        signingOut.current = true

        setUser(null)
        setLoading(false)

        try {
            await supabase.auth.signOut()
        } catch (err) {
            console.error('Sign out error:', err)
        }

        window.location.href = '/login'
    }, [supabase])


    useEffect(() => {
        async function initialize() {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (session?.user) {
                    await loadUserProfile(session.user)
                } else {
                    setLoading(false)
                }
            } catch {
                setLoading(false)
            } finally {
                initialized.current = true
            }
        }

        initialize()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!initialized.current) return
                if (signingOut.current) return

                if (event === 'SIGNED_IN' && session?.user) {
                    await loadUserProfile(session.user)
                    router.push('/dashboard')
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setLoading(false)
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, loadUserProfile, router])

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signIn: handleSignIn,
            signUp: handleSignUp,
            signOut: handleSignOut,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    return useContext(AuthContext)
}