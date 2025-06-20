<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            'username' => [
                'required',
                'string',
                'max:255',
                'alpha_dash', // hanya huruf, angka, dash, underscore
                Rule::unique('users')->ignore($this->user()->id),
            ],

            // 'avatar' => ['nullable', 'url'],
            'avatar' => ['nullable', 'image', 'max:2048'], // max 2MB
            'bio' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:20'],
            'url' => ['nullable', 'url', 'max:255'],
        ];
    }
}
