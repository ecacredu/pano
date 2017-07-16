import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'searchCord',
  pure:false
})

export class SearchCordPipe implements PipeTransform{
  transform(value,term){
    return value.filter((item)=>(
                        item.text.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                         item.designation.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                         item.mobile_number.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                          item.co_email.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                          item.id.toLowerCase().indexOf(term.toLowerCase()) !== -1
                      ));
  }
}
