<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleitor;
use Illuminate\Http\Request;

class EleitorController extends Controller
{
    public function index(Request $request)
    {
        $query = Eleitor::with(['lideranca', 'cabo']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('cpf', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($bairro = $request->query('bairro')) {
            $query->where('bairro', $bairro);
        }

        if ($apoio = $request->query('apoio')) {
            $query->where('apoio', $apoio);
        }

        return $query->latest()->paginate($request->query('per_page', 15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'cpf' => 'nullable|string|max:20',
            'idade' => 'nullable|integer|min:16|max:120',
            'sexo' => 'nullable|string',
            'bairro' => 'nullable|string',
            'cidade' => 'nullable|string',
            'zona' => 'nullable|integer',
            'secao' => 'nullable|integer',
            'telefone' => 'nullable|string',
            'email' => 'nullable|email',
            'escolaridade' => 'nullable|string',
            'apoio' => 'nullable|string',
            'lideranca_id' => 'nullable|exists:liderancas,id',
            'cabo_id' => 'nullable|exists:cabos,id',
            'cadastrado_em' => 'nullable|date',
            'ultima_interacao' => 'nullable|date',
        ]);

        return Eleitor::create($data);
    }

    public function show(Eleitor $eleitor)
    {
        return $eleitor->load(['lideranca', 'cabo', 'visitas', 'conversas']);
    }

    public function update(Request $request, Eleitor $eleitor)
    {
        $data = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'cpf' => 'nullable|string|max:20',
            'idade' => 'nullable|integer|min:16|max:120',
            'sexo' => 'nullable|string',
            'bairro' => 'nullable|string',
            'cidade' => 'nullable|string',
            'zona' => 'nullable|integer',
            'secao' => 'nullable|integer',
            'telefone' => 'nullable|string',
            'email' => 'nullable|email',
            'escolaridade' => 'nullable|string',
            'apoio' => 'nullable|string',
            'lideranca_id' => 'nullable|exists:liderancas,id',
            'cabo_id' => 'nullable|exists:cabos,id',
            'cadastrado_em' => 'nullable|date',
            'ultima_interacao' => 'nullable|date',
        ]);

        $eleitor->update($data);

        return $eleitor;
    }

    public function destroy(Eleitor $eleitor)
    {
        $eleitor->delete();

        return response()->noContent();
    }
}
