import swaggerJSDoc from 'swagger-jsdoc';

export class SwaggerDefinition {
  public static get() {
    return swaggerJSDoc({
      swaggerDefinition: {
        info:     {
          title:       'Vikings of Valhalla',
          description: 'This is an example of how to get swagger to work with a nodeJS app written with expressJS. You can find out more about this hole topic at GitHub. There is no authorization provided but there is no possibility to disable the button. So yeah, have fun with this.',
          version:     '1.0.0'
        },
        host:     'localhost',
        basePath: '/api',
        schemes:  ['http'],
        tags:     [
          {
            'name':        'Vikings',
            'description': 'Control the psychic Vikings of Valhalla'
          }
        ]
      },
      apis:              ['**/application.ts']
    });
  }
}