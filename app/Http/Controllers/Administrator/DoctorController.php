<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Doctor;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class DoctorController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $doctors = Doctor::when($request->filled('search'), function(Builder $query) use ($search) {
            $query->where('name','like',"%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('fee', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
        })->orderByDesc('id')->paginate(5)->onEachSide(3)->withQueryString()->through(function(Doctor $map) {
            $format_rupiah = format_rupiah($map->fee);

            unset($map->fee);

            $map->fee = $format_rupiah;

            return $map;
        });

        $page_num = ($doctors->currentPage() - 1) * $doctors->perPage() + 1;

        return Inertia::render('Administrator/Doctor/Index',[
            'doctors'  => $doctors,
            'page_num' => $page_num
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administrator/Doctor/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'username'      => 'required|string|max:255|unique:'.Doctor::class,
            'password'      => ['required', Rules\Password::defaults()],
            'address'       => 'required|string|max:255',
            'phone_number'  => 'required|string|max:20',
            'fee'           => 'required|integer',
            'status_doctor' => 'required|integer'
        ]);

        $input = $request->all();

        DB::beginTransaction();
        try {
            Doctor::create($input);
            DB::commit();

            return redirect()->intended('/administrator/doctors')->with('success', 'Berhasil Input Dokter!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - '.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $doctor = Doctor::where('id',$id)->firstOrFail();
        return Inertia::render('Administrator/Doctor/Edit',[
            'doctor' => $doctor
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'username'      => 'required|string|max:255|unique:'.Doctor::class.',id,'.$id,
            'password'      => ['sometimes', 'nullable', Rules\Password::defaults()],
            'address'       => 'required|string|max:255',
            'phone_number'  => 'required|string|max:20',
            'fee'           => 'required|integer',
            'status_doctor' => 'required|integer|in:0,1'
        ]);

        if (!$request->filled('password')) {
            $input = $request->except('password');
        }
        else {
            $input = $request->all();
        }

        DB::beginTransaction();

        try {
            Doctor::where('id',$id)->update($input);
            DB::commit();

            return redirect()->intended('/administrator/doctors')->with('success', 'Berhasil Update Dokter!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }

    public function updateStatus(int $id): RedirectResponse
    {
        $doctor = Doctor::where('id',$id)->firstOrFail();

        if ($doctor->status_doctor == 1) {
            Doctor::where('id',$id)->update(['status_doctor' => 0]);
            $message = 'Berhasil Non Aktifkan Dokter!';
        }
        else {
            Doctor::where('id',$id)->update(['status_doctor' => 1]);
            $message = 'Berhasil Aktifkan Dokter!';
        }

        return redirect()->intended('/administrator/doctors')->with('success', $message);
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            Doctor::where('id',$id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/doctors')->with('success', 'Berhasil Hapus Dokter!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' -  Line: '.$e->getLine());
        }
    }
}
