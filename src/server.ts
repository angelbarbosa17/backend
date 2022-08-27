import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import cors from "cors";
const pkg = require('../package.json');
import { UserRouter } from "./user/user.router";
import { ConfigServer } from "./config/config";
import { RoleRouter } from "./role/role.router";
import { DataSource } from "typeorm";
import { LoginStrategy } from "./auth/strategies/login.strategy";
import { JwtStrategy } from "./auth/strategies/jwt.strategy";
import { AuthRouter } from "./auth/auth.router";
import { InitRoleService } from "./config/init.default.roles"

class ServerBootstrap extends ConfigServer {
  public app: express.Application = express();
  private port: number = this.getNumberEnv("PORT");
  
  private initRoleService: InitRoleService = new InitRoleService();
  
  constructor() {
    super();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.set('pkg', pkg);
    this.passportUse();
    this.dbConnect();
    this.app.use(morgan("dev"));
    this.initRoleService.initRoles();
    this.app.use(
      cors({
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
      })
    );

    this.app.get('/api/unihorizonte/', (req, res) => {
      res.json({
        name: this.app.get('pkg').name,
        description: this.app.get('pkg').description,
        author: this.app.get('pkg').author,
        version: this.app.get('pkg').version,
      })
    });
    
    this.app.use("/api/unihorizonte", this.routers());
    this.listen();
  }

  routers(): Array<express.Router> {
    return [
      new UserRouter().router,
      new RoleRouter().router,
      new AuthRouter().router,
    ];
  }

  passportUse() {
    return [new LoginStrategy().use, new JwtStrategy().use];
  }

  async dbConnect(): Promise<DataSource | void> {
    return this.initConnect
      .then(() => {
        console.log("Connect Success");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(
        `Listen in ${this.port} :: ENV = ${this.getEnvironment("ENV")}`
      );
    });
  }
}

new ServerBootstrap();
