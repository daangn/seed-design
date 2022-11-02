import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import * as React from "react";

const NotFoundPage = () => {
  return (
    <div>
      404 - <Link to="/">Go home</Link>
    </div>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
