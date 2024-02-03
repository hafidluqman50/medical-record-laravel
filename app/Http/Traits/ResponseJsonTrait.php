<?php 

namespace App\Http\Traits;

use Auth;
use Exception;
use Illuminate\Http\JsonResponse;

trait ResponseJsonTrait 
{
    protected string $responseMsg;

    protected array $pagination;

    protected array $toResponse;

    /**
     * property $dataResponse generic union type <Collection|Model|array>.
     *
     * @var <Collection|Model|array>
     */
    protected $dataResponse; //need generic type

    public function responseResult($data = []): self
    {
        $this->dataResponse = $data;

        return $this;
    }

    public function message(string $message): self
    {
        $this->responseMsg = $message;

        return $this;
    }

    public function withPagination(array $pagination = []): self
    {
        $this->pagination['pagination'] = $pagination;

        return $this;
    }

    public function toMapperResponse(
        bool $status,
        // string $message,
        // $data = [],
        int $http_code
    ): self
    {
        if(empty($this->responseMsg)) {
            throw new Exception('Message can\'t be empty!');
        }
        if(empty($http_code)) {
            throw new Exception('HTTP Code can\'t be empty!');
        }

        $response = [
            'status' => $status,
            'message' => $this->responseMsg,
        ];

        if (!empty($this->dataResponse)) {
            $response['data'] = $this->dataResponse;
        }

        if (!empty($this->pagination['pagination'])) {
            $response['pagination'] = $this->pagination['pagination'];
        }

        $this->toResponse['response']  = $response;
        $this->toResponse['http_code'] = $http_code;

        return $this;
    }

    public function withToken(): JsonResponse 
    {

        if (!isset($this->dataResponse['token'])) {
            throw new Exception('Token Not Set! make sure use index token to set!');
        }

        $response = [
            'token'      => $this->dataResponse['token'],
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL(),
        ];

        $this->toResponse['response']  = $response;
        $this->toResponse['http_code'] = 200;

        return $this->toResponseJson();
    }

    public function toResponseJson(): JsonResponse
    {
        return response()->json(
            $this->toResponse['response'], 
            $this->toResponse['http_code']
        );
    }

    public function success(int $code): JsonResponse
    {
        return $this->toMapperResponse(
            true,
            $code
        )->toResponseJson();
    }

    public function fail(int $code): JsonResponse
    {
        return $this->toMapperResponse(
            false,
            $code
        )->toResponseJson();
    }

    public function ok(): JsonResponse
    {
        return $this->toMapperResponse(
            true,
            200
        )->toResponseJson();
    }

    public function created(): JsonResponse
    {
        return $this->toMapperResponse(
            true,
            201
        )->toResponseJson();
    }

    public function badRequest(): JsonResponse
    {
        return $this->toMapperResponse(
            false,
            400
        )->toResponseJson();
    }

    public function unauthorized(): JsonResponse
    {
        return $this->toMapperResponse(
            false,
            401
        )->toResponseJson();
    }

    public function forbidden(): JsonResponse
    {
        return $this->toMapperResponse(
            false,
            403
        )->toResponseJson();
    }

    public function notFound(): JsonResponse
    {
        return $this->toMapperResponse(
            false,
            404
        )->toResponseJson();
    }

    public function methodNotAllowed(): JsonResponse
    {
        return $this->toMapperResponse(
            false,
            405
        )->toResponseJson();
    }

    public function unprocessableContent(): JsonResponse
    {
        return $this->toMapperResponse(
            false,
            422
        )->toResponseJson();
    }
    
    public function internalServerError(): JsonResponse
    {
        return $this->toMapperResponse(
            false,
            500
        )->toResponseJson();
    }
}