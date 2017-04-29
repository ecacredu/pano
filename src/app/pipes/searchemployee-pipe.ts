import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'search',
  pure:false
})

export class SearchEmpPipe implements PipeTransform{
  transform(value,term){
    return value.filter((item)=>(
                        item.text.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                         item.designation.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                         item.mobile_number.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                          item.co_mail.toLowerCase().indexOf(term.toLowerCase()) !== -1
                      ));
  }
}
