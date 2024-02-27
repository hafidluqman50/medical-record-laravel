<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GuardCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $guard): Response
    {   
        if(!auth()->guard($guard)->check()) {
            if ($guard == 'doctor') {
                return redirect()->intended('login-doctor')->with('error', 'You\'re Not Login yet!');
            }
            else {
                return redirect()->intended('login')->with('error', 'You\'re Not Login yet!');
            }
        }

        return $next($request);
    }
}
