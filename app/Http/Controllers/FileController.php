<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    public function show(string $filepath): StreamedResponse
    {
        // Ambil nama disk dari .env (default ke 'public' jika tidak disetel)
        $disk = config('filesystems.default', 'local');

        // Bersihkan path dari karakter berbahaya
        $safePath = ltrim(str_replace(['../', './'], '', $filepath), '/');

        // Periksa apakah file ada
        if (!Storage::disk($disk)->exists($safePath)) {
            abort(404, 'File not found.');
        }

        // Kembalikan file sebagai response
        return Storage::disk($disk)->response($safePath);
    }
}
