import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'normalSearch',
  pure:false
})

export class SearchPipe implements PipeTransform{
  transform(value,term){
    return value.filter((item)=>(
                         item.uid.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                          item.name.toLowerCase().indexOf(term.toLowerCase()) !== -1));
  }
}
