import { AppDataSource } from "./config/data-source";
import { User } from "./entity/User";

AppDataSource.initialize()
  .then(async () => {
    const user = new User();

    await AppDataSource.manager.save(user);
  })
  .catch(() => {});
