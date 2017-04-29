import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'search',
  pure:false
})

export class SearchPackagePipe implements PipeTransform{
  transform(value,term){
    return value.filter((item)=>(
                        item.tour_details.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                        item.title.toLowerCase().indexOf(term.toLowerCase()) !== -1 
                      ));
  }
}