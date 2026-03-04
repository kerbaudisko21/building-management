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

// Cache role across re-renders so we never flash wrong role
let _roleCache: Record<string, UserRole> = {}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = getSupabase()

    const initialized = useRef(false)
    const signingOut = useRef(false)
    const userRef = useRef<AuthUser | null>(null)

    // Only call setUser if data actually changed — prevents tree re-render
    const setUserSafe = useCallback((newUser: AuthUser | null) => {
        const prev = userRef.current
        if (prev === newUser) return
        if (prev && newUser &&
            prev.id === newUser.id &&
            prev.role === newUser.role &&
            prev.fullName === newUser.fullName &&
            prev.email === newUser.email
        ) return // Same data — skip re-render
        userRef.current = newUser
        setUser(newUser)
    }, [])

    // Fetch profile from DB
    const fetchProfile = useCallback(async (authUser: User): Promise<AuthUser> => {
        const fallbackName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role, full_name')
                .eq('id', authUser.id)
                .single()
            const role = (profile?.role as UserRole) || _roleCache[authUser.id] || 'admin'
            _roleCache[authUser.id] = role
            return { id: authUser.id, email: authUser.email || '', role, fullName: profile?.full_name || fallbackName }
        } catch {
            const role = _roleCache[authUser.id] || 'admin'
            return { id: authUser.id, email: authUser.email || '', role, fullName: fallbackName }
        }
    }, [supabase])

    const handleSignIn = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (data.user) {
            const fullUser = await fetchProfile(data.user)
            setUserSafe(fullUser)
            setLoading(false)
            router.push('/dashboard')
        }
    }, [supabase, router, fetchProfile, setUserSafe])

    const handleSignUp = useCallback(async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
        if (error) throw error
    }, [supabase])

    const handleSignOut = useCallback(async () => {
        if (signingOut.current) return
        signingOut.current = true
        _roleCache = {}
        setUserSafe(null)
        setLoading(false)
        try { await supabase.auth.signOut() } catch {}
        window.location.href = '/login'
    }, [supabase, setUserSafe])

    useEffect(() => {
        let cancelled = false

        async function initialize() {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (cancelled) return
                if (session?.user) {
                    const fullUser = await fetchProfile(session.user)
                    if (!cancelled) setUserSafe(fullUser)
                }
            } catch {}
            if (!cancelled) {
                setLoading(false)
                initialized.current = true
            }
        }

        initialize()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!initialized.current || signingOut.current) return

                if (event === 'TOKEN_REFRESHED' && session?.user) {
                    // Only refresh role, don't setUser if data is same
                    const fullUser = await fetchProfile(session.user)
                    if (!signingOut.current) setUserSafe(fullUser)
                } else if (event === 'SIGNED_OUT') {
                    setUserSafe(null)
                    setLoading(false)
                }
                // IMPORTANT: Ignore SIGNED_IN from onAuthStateChange
                // We already handle sign-in in handleSignIn above.
                // Supabase fires SIGNED_IN on focus/visibilitychange which
                // would cause unnecessary re-renders and kill page data fetches.
            }
        )

        return () => {
            cancelled = true
            subscription.unsubscribe()
        }
    }, [supabase, fetchProfile, setUserSafe])

    return (
        <AuthContext.Provider value={{ user, loading, signIn: handleSignIn, signUp: handleSignUp, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    return useContext(AuthContext)
}