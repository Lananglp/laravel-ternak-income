<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    public function show(string $filepath): StreamedResponse
    {
        // Periksa apakah file ada di disk 'local'
        if (!Storage::disk('local')->exists($filepath)) {
            abort(404);
        }

        // Kembalikan file sebagai response
        // Laravel akan otomatis mengatur header Content-Type yang benar
        return Storage::disk('local')->response($filepath);
    }
}
