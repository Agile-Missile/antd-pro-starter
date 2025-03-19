import { Button, Result } from 'antd';
import { Link } from '@umijs/max';

export default function Exception403() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Link to="/">
          <Button type="primary">Back to home</Button>
        </Link>
      }
    />
  );
}
