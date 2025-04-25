import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { initializeDatabases } from "./config/orm.config";
import { config } from "./config/env";
import { NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError } from "./utils/response";
import swaggerDocs from "./config/swagger";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.database();
    this.routes();
    this.errorHandler();
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(morgan("dev"));
  }

  private async database(): Promise<void> {
    try {
      await initializeDatabases();
      console.log("Databases connected");
    } catch (error) {
      console.error("Unable to connect to databases:", error);
      process.exit(1);
    }
  }

  private routes(): void {
    this.express.use("/api", routes);
    swaggerDocs(this.express);
  }

  private errorHandler(): void {
    this.express.use(((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);

      if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: err.message });
      }

      if (err instanceof UnauthorizedError) {
        return res.status(401).json({ success: false, message: err.message });
      }

      if (err instanceof ForbiddenError) {
        return res.status(403).json({ success: false, message: err.message });
      }

      if (err instanceof BadRequestError) {
        return res.status(400).json({ success: false, message: err.message });
      }

      res.status(500).json({ success: false, message: "Internal server error" });
    }) as express.ErrorRequestHandler);
  }
}

export default new App().express;
