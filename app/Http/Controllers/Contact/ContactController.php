<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contact;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('contact/contact', [
            'contacts' => $contacts
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        return Inertia::render('contact/contact-create', [
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'required|string|max:20',
            'message' => 'required|string|max:5000',
        ]);

        $user = auth()->user();

        Contact::create([
            ...$validated,
            'user_id' => $user->id,
            'is_read' => false, // default (optional karena default di DB)
        ]);

        return redirect()->back()->with('success', 'Pesan berhasil terkirim.');
    }

    public function markAsRead(Contact $contact)
    {
        if (!$contact->is_read) {
            $contact->is_read = true;
            $contact->save();
        }

        return back();
    }
}
