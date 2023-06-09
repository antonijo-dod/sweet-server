import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import RecipesRoute from '@routes/recipes.route'
import IngredientsRoute from './routes/ingredients.route';
import CategoriesRoute from './routes/categories.route';
import ImagesRoute from './routes/images.route'
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([
    new IndexRoute(),
    new UsersRoute(),
    new AuthRoute(),
    new RecipesRoute(),
    new IngredientsRoute(),
    new CategoriesRoute(),
    new ImagesRoute()]);

app.listen();
