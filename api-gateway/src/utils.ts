import { Request, Response } from "express";
import config from "./config.json";
import axios from "axios";
import middlewares from "./middlewares";
// console.log(config)

const createHandler = (hostName: string, path: string, method: string) => {
  return async (req: Request, res: Response) => {
    try {
      let url = `${hostName}${path}`;
      req.params &&
        Object.keys(req.params).forEach((params) => {
          url.replace(`:${params}`, req.params[params]);
        });

      const { data } = await axios({
        method,
        url,
        data: req.body,
        headers: {
          origin: "http://localhost:8081",
          "x-user-id": req.headers["x-user-id"] || "",
          "x-user-name": req.headers["x-user-name"] || "",
          "x-user-email": req.headers["x-user-email"] || "",
          "x-user-role": req.headers["x-user-role"] || "",
          "x-user-agent": req.headers["x-user-agent"] || "",
        },
      });
      res.json(data);
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        return res
          .status(error.response?.status || 500)
          .json(error.response?.data);
      }
      return res.status(500).json({ message: "internal server error" });
    }
  };
};

export const getMiddleware = (names: string[]) => {
  return names.map((name: string) => middlewares.find((m) => m.name === name));
};

export const configureRoute = (app: any) => {
  Object.entries(config.services).forEach(([_name, service]) => {
    const hostName = service.url;

    service.routes.forEach((route) => {
      // console.log(route)
      route.methods.forEach((method) => {
        const endpoint = `/api${route.path}`;
        const middleware = getMiddleware(route.middleware);
        const handler = createHandler(hostName, route.path, method);
        app[method](endpoint, middleware, handler);
      });
    });
  });
};
