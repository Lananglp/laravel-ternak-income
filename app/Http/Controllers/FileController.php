<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    private string $disk;

    public function __construct()
    {
        $this->disk = config('filesystems.default', 'local');
    }

    public function show(string $filepath): StreamedResponse
    {

        // Bersihkan path dari karakter berbahaya
        $safePath = ltrim(str_replace(['../', './'], '', $filepath), '/');

        // Periksa apakah file ada
        if (!Storage::disk($this->disk)->exists($safePath)) {
            abort(404, 'File not found.');
        }

        // Kembalikan file sebagai response
        return Storage::disk($this->disk)->response($safePath);
    }

    public function video(string $filepath): StreamedResponse
    {
        $safePath = ltrim(str_replace(['../', './'], '', $filepath), '/');

        if (!Storage::disk($this->disk)->exists($safePath)) {
            abort(404, 'Video not found.');
        }

        // Return video stream
        return Storage::disk($this->disk)->response($safePath, null, [
            'Content-Type' => Storage::disk($this->disk)->mimeType($safePath),
            'Accept-Ranges' => 'bytes',
        ]);
    }

    public function videoTumbnail(string $filepath): StreamedResponse
    {

        // Bersihkan path dari karakter berbahaya
        $safePath = ltrim(str_replace(['../', './'], '', $filepath), '/');

        // Periksa apakah file ada
        if (!Storage::disk($this->disk)->exists($safePath)) {
            abort(404, 'File not found.');
        }

        // Kembalikan file sebagai response
        return Storage::disk($this->disk)->response($safePath);
    }
}
