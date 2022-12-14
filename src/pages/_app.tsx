
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import  AuthBasic from './auth'
import { Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react'
import { supabase } from '../libs/supabase'

export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<Session | null>()
  useEffect(() => {
    async function getSession() {
      const {
        data: { session: _session },
      } = await supabase.auth.getSession();
      setSession(_session);
    }

    getSession();
  }, []);

  return !session ? <AuthBasic /> : <Component {...pageProps} />
}
