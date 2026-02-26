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

function makeBasicUser(authUser: User): AuthUser {
    return {
        id: authUser.id,
        email: authUser.email || '',
        role: 'admin',
        fullName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = getSupabase()

    const initialized = useRef(false)
    const signingOut = useRef(false)

    // Load full profile (await for correct role)
    const loadProfileInBackground = useCallback(async (authUser: User) => {
        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()
            if (signingOut.current) return
            if (profile) {
                setUser({
                    id: authUser.id,
                    email: authUser.email || '',
                    role: profile.role || 'admin',
                    fullName: profile.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                })
            }
        } catch {
            // Profile fetch failed - keep basic user
        }
    }, [supabase])

    // ═══ SIGN IN ═══
    // Redirect IMMEDIATELY after Supabase auth succeeds
    // Don't wait for profile fetch
    const handleSignIn = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        if (data.user) {
            // Set basic user immediately from auth response
            setUser(makeBasicUser(data.user))
            setLoading(false)

            // Redirect NOW — don't wait for anything else
            router.push('/dashboard')

            // Load full profile in background
            loadProfileInBackground(data.user)
        }
    }, [supabase, router, loadProfileInBackground])

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
                // getSession() = local cookie read = FAST
                const { data: { session } } = await supabase.auth.getSession()

                if (session?.user) {
                    setUser(makeBasicUser(session.user))
                    setLoading(false)
                    loadProfileInBackground(session.user)
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
                    // Just update user state — handleSignIn already did the redirect
                    setUser(makeBasicUser(session.user))
                    setLoading(false)
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setLoading(false)
                } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                    loadProfileInBackground(session.user)
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, loadProfileInBackground])

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
