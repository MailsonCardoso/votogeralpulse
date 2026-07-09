<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

abstract class BaseApiController extends Controller
{
    protected string $model;
    protected array $rules = [];
    protected array $updateRules = [];
    protected array $with = [];

    public function index(Request $request)
    {
        $query = ($this->model)::query()->with($this->with);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                foreach (['nome', 'titulo', 'descricao'] as $field) {
                    if (\Schema::hasColumn((new $this->model)->getTable(), $field)) {
                        $q->orWhere($field, 'like', "%{$search}%");
                    }
                }
            });
        }

        return $query->latest()->paginate($request->query('per_page', 15));
    }

    public function show($id)
    {
        return ($this->model)::with($this->with)->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules);

        return ($this->model)::create($data);
    }

    public function update(Request $request, $id)
    {
        /** @var Model $model */
        $model = ($this->model)::findOrFail($id);
        $data = $request->validate($this->updateRules ?: $this->rules);
        $model->update($data);

        return $model;
    }

    public function destroy($id)
    {
        /** @var Model $model */
        $model = ($this->model)::findOrFail($id);
        $model->delete();

        return response()->noContent();
    }
}
