import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index') //@Render  main.ts 에서 설정한 view 페이지의 index.hbs 렌더링
  root() {
    return {
      data: {
        title: 'title',
        copyright: 'aaa',
      },
    };
  }
}
