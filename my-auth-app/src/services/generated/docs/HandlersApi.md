# HandlersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**login**](#login) | **POST** /api/auth/login | |
|[**logout**](#logout) | **POST** /api/auth/logout | |
|[**profile**](#profile) | **GET** /api/users/profile | |
|[**refresh**](#refresh) | **POST** /api/auth/refresh | |
|[**register**](#register) | **POST** /api/auth/register | |

# **login**
> LoginResponse login(loginRequest)


### Example

```typescript
import {
    HandlersApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new HandlersApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.login(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**LoginResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful |  -  |
|**401** | Invalid credentials |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
> logout()


### Example

```typescript
import {
    HandlersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HandlersApi(configuration);

const { status, data } = await apiInstance.logout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Logout successful |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **profile**
> UserProfileResponse profile()


### Example

```typescript
import {
    HandlersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HandlersApi(configuration);

const { status, data } = await apiInstance.profile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserProfileResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User profile data |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refresh**
> LoginResponse refresh()


### Example

```typescript
import {
    HandlersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HandlersApi(configuration);

const { status, data } = await apiInstance.refresh();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**LoginResponse**

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Token refreshed successfully |  -  |
|**401** | Invalid or missing refresh token |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **register**
> UserProfileResponse register(registerRequest)


### Example

```typescript
import {
    HandlersApi,
    Configuration,
    RegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new HandlersApi(configuration);

let registerRequest: RegisterRequest; //

const { status, data } = await apiInstance.register(
    registerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerRequest** | **RegisterRequest**|  | |


### Return type

**UserProfileResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | User created successfully |  -  |
|**400** | Invalid input or email already exists |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

