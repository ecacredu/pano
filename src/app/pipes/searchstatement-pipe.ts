import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'searchStatement',
  pure:false
})

export class SearchStatePipe implements PipeTransform{
  transform(value,term){
    return value.filter((item)=>(
                        ((item.date) ? item.date.toLowerCase().indexOf(term.toLowerCase()) !== -1:true) ||
                         item.description.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                         item.type.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                          item.milage.toLowerCase().indexOf(term.toLowerCase()) !== -1 
                      ));
  }
}
