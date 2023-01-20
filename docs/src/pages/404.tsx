import type { HeadFC } from "gatsby";
import { Link } from "gatsby";

const NotFoundPage = () => {
  return (
    <div>
      404 - <Link to="/">Go home</Link>
    </div>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>404 | SEED Design</title>;
