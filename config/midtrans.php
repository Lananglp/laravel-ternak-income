<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'server_key'     => env('MIDTRANS_SERVER_KEY'),
    'client_key'     => env('MIDTRANS_CLIENT_KEY'),
    'is_production'  => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sanitized'   => true,
    'is_3ds'         => true,

];
