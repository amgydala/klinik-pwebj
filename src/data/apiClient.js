const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

let refreshRequest;

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const readStoredToken = () =>
  sessionStorage.getItem("simklinik_token") ||
  localStorage.getItem("simklinik_token");

export const clearStoredSession = () => {
  sessionStorage.removeItem("simklinik_token");
  sessionStorage.removeItem("simklinik_user");
  localStorage.removeItem("simklinik_token");
  localStorage.removeItem("simklinik_user");
};

const saveToken = (token, rememberMe) => {
  sessionStorage.removeItem("simklinik_token");
  localStorage.removeItem("simklinik_token");
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("simklinik_token", token);
};

const formatErrorMessage = (body, fallback) => {
  if (body && typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }

  if (body?.errors && typeof body.errors === "object") {
    const messages = Object.values(body.errors).flat().filter(Boolean);
    if (messages.length) return messages.join(" ");
  }

  return fallback;
};

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(
      "Respons server tidak dapat dibaca. Silakan coba kembali.",
      response.status
    );
  }
};

const refreshAccessToken = () => {
  if (!refreshRequest) {
    const token = readStoredToken();
    if (!token) {
      return Promise.reject(new ApiError("Sesi Anda telah berakhir.", 401));
    }

    refreshRequest = fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const body = await parseResponse(response);
        if (!response.ok) {
          throw new ApiError(
            formatErrorMessage(body, "Sesi Anda telah berakhir."),
            response.status,
            body.errors
          );
        }

        const payload = body.data || body;
        if (!payload.token) {
          throw new ApiError("Server tidak mengembalikan token baru.");
        }

        const rememberMe = Boolean(localStorage.getItem("simklinik_user"));
        saveToken(payload.token, rememberMe);
        return payload.token;
      })
      .catch((error) => {
        clearStoredSession();
        throw error;
      })
      .finally(() => {
        refreshRequest = undefined;
      });
  }

  return refreshRequest;
};

export const apiRequest = async (
  path,
  {
    method = "GET",
    body,
    authenticated = true,
    retryUnauthorized = true,
    headers: extraHeaders,
  } = {}
) => {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  Object.assign(headers, extraHeaders);

  const token = authenticated ? readStoredToken() : null;
  if (authenticated && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiError(
      `Tidak dapat terhubung ke server klinik (${API_BASE_URL}). Pastikan backend sedang berjalan.`
    );
  }

  if (
    response.status === 401 &&
    authenticated &&
    token &&
    retryUnauthorized &&
    path !== "/refresh"
  ) {
    try {
      await refreshAccessToken();
      return await apiRequest(path, {
        method,
        body,
        authenticated,
        retryUnauthorized: false,
        headers: extraHeaders,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Sesi Anda telah berakhir. Silakan masuk kembali.", 401);
    }
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    if (response.status === 401 && authenticated && token) {
      clearStoredSession();
    }
    throw new ApiError(
      formatErrorMessage(payload, `Permintaan gagal (${response.status}).`),
      response.status,
      payload.errors
    );
  }

  return payload;
};

export const storeSession = (user, token, rememberMe = true) => {
  clearStoredSession();
  saveToken(token, rememberMe);
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("simklinik_user", JSON.stringify(user));
  localStorage.removeItem("simklinik_current_user");
  localStorage.removeItem("simklinik_patients");
};

export const getStoredUser = () => {
  const raw =
    sessionStorage.getItem("simklinik_user") ||
    localStorage.getItem("simklinik_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    clearStoredSession();
    return null;
  }
};

export const updateStoredUser = (user) => {
  const storage = sessionStorage.getItem("simklinik_user")
    ? sessionStorage
    : localStorage;
  storage.setItem("simklinik_user", JSON.stringify(user));
};

export const getStoredToken = readStoredToken;
export const forgetSession = clearStoredSession;
