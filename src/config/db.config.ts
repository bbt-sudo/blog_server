export function dbConfig() {
  return {
    type: 'mysql', // 数据库类型
    host: '36.138.193.203', // 数据库地址
    port: 3306, // 端口
    username: 'pony_blog', //'nest_test', // 用户名
    password: 'pony_blog', //'5LPX6zjd3pXzmzar', // 密码
    database: 'ApsPtG8XMXWanbXb', //'nest_test', // 数据库名
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // 实体类
    synchronize: true, // 自动创建表
    autoLoadEntities: true, // 自动加载实体类
  };
}
//'203.33.207.138'
