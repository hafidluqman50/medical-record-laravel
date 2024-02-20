<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'administrator/stock-opnames/store',
        'administrator/transaction-upds/store',
        'administrator/transaction-hv/store',
        'administrator/transaction-resep/store',
        'administrator/transaction-credit/store'
    ];
}
