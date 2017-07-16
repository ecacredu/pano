import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'searchInvoice',
  pure:false
})

export class SearchInvoicePipe implements PipeTransform{
  transform(value,term){
    return value.filter((item)=>(
                        item.title.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                         item.description.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                         item.journey_date.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                          item.net_invoice_amount.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
                          item.status.toLowerCase().indexOf(term.toLowerCase()) !== -1
                      ));
  }
}
