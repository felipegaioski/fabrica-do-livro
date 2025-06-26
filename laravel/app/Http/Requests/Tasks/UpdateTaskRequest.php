<?php

namespace App\Http\Requests\Tasks;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string'],
            'description' => 'nullable',
            'status_id' => 'nullable',
            'completed_at' => ['required_if:status_id,2', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'O campo "Título" é obrigatório.',
            'title.string' => 'O campo "Título" deve ser uma string.',
        ];
    }
}
