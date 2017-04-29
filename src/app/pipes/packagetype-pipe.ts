import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'packagetype',
  pure:false
})

export class PackageTypePipe implements PipeTransform{
  transform(value,term){
    return value.filter((item)=>(
                         item.packagetype.toLowerCase().indexOf(term.toLowerCase()) !== -1));
  }
}
