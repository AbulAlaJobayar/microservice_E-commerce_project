import { Express, Request, Response } from "express";
import config from "./config.json";
import axios from "axios";
// console.log(config)

const createHandler = (hostName: string, path: string, method: string) => {
  return async (req: Request, res: Response) => {
    try {
      const { data } = await axios({
        method,
        url: `${hostName}${path}`,
        data: req.body,
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
export const configureRoute = (app:any) => {
  Object.entries(config.services).forEach(([name, service]) => {
    const hostName = service.url;

    service.routes.forEach((route) => {
      // console.log(route)
      route.methods.forEach((method) => {
        const handler = createHandler(hostName, route.path, method);
        app[method](`/api${route.path}`, handler);
      });
    });
  });
};
