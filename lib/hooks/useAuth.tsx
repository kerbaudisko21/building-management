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

// Persistent role cache to survive re-renders
let _roleCache: Record<string, UserRole> = {}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = getSupabase()

    const initialized = useRef(false)
    const signingOut = useRef(false)

    // Fetch profile from DB — returns role
    const fetchProfile = useCallback(async (authUser: User): Promise<AuthUser> => {
        // Check cache first
        const cached = _roleCache[authUser.id]
        const fallbackName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'

        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role, full_name')
                .eq('id', authUser.id)
                .single()

            const role = (profile?.role as UserRole) || cached || 'admin'
            _roleCache[authUser.id] = role

            return {
                id: authUser.id,
                email: authUser.email || '',
                role,
                fullName: profile?.full_name || fallbackName,
            }
        } catch {
            return {
                id: authUser.id,
                email: authUser.email || '',
                role: cached || 'admin',
                fullName: fallbackName,
            }
        }
    }, [supabase])

    // ═══ SIGN IN ═══
    const handleSignIn = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        if (data.user) {
            // Load profile WITH role BEFORE redirect
            const fullUser = await fetchProfile(data.user)
            setUser(fullUser)
            setLoading(false)
            router.push('/dashboard')
        }
    }, [supabase, router, fetchProfile])

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
        _roleCache = {}
        setUser(null)
        setLoading(false)
        try { await supabase.auth.signOut() } catch {}
        window.location.href = '/login'
    }, [supabase])

    useEffect(() => {
        async function initialize() {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    const fullUser = await fetchProfile(session.user)
                    setUser(fullUser)
                }
            } catch {}
            setLoading(false)
            initialized.current = true
        }

        initialize()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!initialized.current) return
                if (signingOut.current) return

                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
                    const fullUser = await fetchProfile(session.user)
                    if (!signingOut.current) setUser(fullUser)
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setLoading(false)
                }
            }
        )

        return () => { subscription.unsubscribe() }
    }, [supabase, fetchProfile])

    return (
        <AuthContext.Provider value={{ user, loading, signIn: handleSignIn, signUp: handleSignUp, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    return useContext(AuthContext)
}
