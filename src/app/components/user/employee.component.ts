import { Component, ViewChild, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { SearchEmpPipe } from '../../pipes/searchemployee-pipe';
import { Validators, FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { SelectComponent } from 'ng2-select/ng2-select';
import { LocalStorageService, LocalStorage } from 'ng2-webstorage';
import { ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData } from 'ng2-toasty';
import { SweetAlertService } from 'ng2-sweetalert2';
import { UserService } from '../../providers/userservice';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var jQuery: any;

@Component({
  selector: 'user-employee',
  templateUrl: 'employee.component.html',
  styleUrls: ['employee.component.css']
})

export class UserEmployeesComponent {

  @ViewChild('lgModal') public lgModal: ModalDirective;

  @ViewChild('ci')
  private ciselect: SelectComponent;

  @ViewChild('st')
  private stselect: SelectComponent;

  @ViewChild('co')
  private coselect: SelectComponent;

  public username: any = '';
  public mail: any = '';
  public fname: any = '';
  public lname: any = '';
  public mobile: any = '';
  public thoroughfare: any = '';
  public postal_code: any = '';
  public comail: any = '';
  public spousename: any = '';
  public designation: any = '';

  public role: string = '4';

  public disabled=false;

  addUserForm: FormGroup;
  public activeUser: any;
  public customSearch: string = "";
  public allCords: any = [];

  public dt: Date = new Date();
  public Bdt: Date = new Date();
  public showWedDatePicker: boolean = false;
  public showBirthDatePicker: boolean = false;
  public maritalstatus: string = 'Unmarried';

  public wedDay: string = ''; public wedMonth: string = ''; public wedYear: string = '';
  public birthDay: string = ''; public birthMonth: string = ''; public birthYear: string = '';
  public addState: string = ''; public addCity: string = ''; public addCountry: string = '';

  public updateIn: boolean = false;

  public newCoordinatorForm: any;

  public waitToastID: any;
  public successToastID: any;
  public errorToastID: any;

  public upUser: any;
  public upCord: any;
  public country: Array<string> = ["India"]

  public states: Array<string> = ["AP|Andhra Pradesh", "AR|Arunachal Pradesh", "AS|Assam", "BR|Bihar",
    "CT|Chhattisgarh", "GA|Goa", "GJ|Gujarat", "HR|Haryana", "HP|Himachal Pradesh", "JK|Jammu and Kashmir",
    "JH|Jharkhand", "KA|Karnataka", "KL|Kerala", "MP|Madhya Pradesh", "MH|Maharashtra", "MN|Manipur", "ML|Meghalaya",
    "MZ|Mizoram", "NL|Nagaland", "OR|Odisha", "PB|Punjab", "RJ|Rajasthan", "SK|Sikkim", "TN|Tamil Nadu", "TG|Telangana",
    "TR|Tripura", "UT|Uttarakhand", "UP|Uttar Pradesh", "WB|West Bengal", "AN|Andaman and Nicobar Islands",
    "CH|Chandigarh", "DN|Dadra and Nagar Haveli", "DD|Daman and Diu", "DL|Delhi", "LD|Lakshadweep", "PY|Puducherry"];

  public cities: Array<string> = ["Bhandup", "Mumbai", "Visakhapatnam", "Coimbatore", "Delhi", "Bangalore", "Pune",
    "Nagpur", "Lucknow", "Vadodara", "Indore", "Jalalpur", "Bhopal", "Kolkata", "Kanpur", "New Delhi", "Faridabad",
    "Rajkot", "Ghaziabad", "Chennai", "Meerut", "Agra", "Jaipur", "Jabalpur", "Varanasi", "Allahabad", "Hyderabad",
    "Noida", "Howrah", "Thane", "Patiala", "Chakan", "Ahmedabad", "Manipala", "Mangalore", "Panvel", "Udupi", "Rishikesh",
    "Gurgaon", "Mathura", "Shahjahanpur", "Bagpat", "Sriperumbudur", "Chandigarh", "Ludhiana", "Palakkad", "Kalyan",
    "Valsad", "Ulhasnagar", "Bhiwani", "Shimla", "Dehradun", "Patna", "Unnao", "Tiruvallur", "Kanchipuram", "Jamshedpur",
    "Gwalior", "Karur", "Erode", "Gorakhpur", "Ooty", "Haldwani", "Bikaner", "Puducherry", "Nalbari", "Bellary", "Vellore",
    "Naraina", "Mandi", "Rupnagar", "Jodhpur", "Roorkee", "Aligarh", "Indraprast", "Karnal", "Tanda", "Amritsar", "Raipur",
    "Pilani", "Bilaspur", "Srinagar", "Guntur", "Kakinada", "Warangal", "Tirumala - Tirupati", "Nizamabad", "Kadapa",
    "Kuppam", "Anantpur", "Nalgonda", "Potti", "Nellore", "Rajahmundry", "Bagalkot", "Kurnool", "Secunderabad", "Mahatma",
    "Bharuch", "Miraj", "Nanded", "Anand", "Gandhinagar", "Bhavnagar", "Morvi", "Aurangabad", "Modasa", "Patan", "Solapur",
    "Kolhapur", "Junagadh", "Akola", "Bhuj", "Karad", "Jalgaon Jamod", "Chandrapur", "Maharaj", "Dhule", "Ponda", "Dahod",
    "Navsari", "Panjim", "Patel", "Nashik", "Amravati", "Somnath", "Ganpat", "Karwar", "Davangere", "Raichur", "Nagara",
    "Kushalnagar", "Hassan", "Hubli", "Bidar", "Belgaum", "Mysore", "Dharwad", "Kolar", "TumkÅ«r", "Tiruchi",
    "Thiruvananthapuram", "Kozhikode", "Thrissur", "Madurai", "Thalassery", "Kannur", "Karaikudi", "Thanjavur",
    "Manor", "Idukki", "Thiruvarur", "Alappuzha", "Gandhigram", "Kochi", "Annamalainagar", "Amet", "Kottarakara",
    "Kottayam", "Tirunelveli", "Mohan", "Salem", "Attingal", "Chitra", "Chengannur", "Guwahati", "Kalam", "Ranchi",
    "Shillong", "Gangtok", "Srikakulam", "Tezpur", "Bhubaneswar", "Imphal", "Sundargarh", "Arunachal", "Manipur",
    "Bihar Sharif", "Mandal", "Dibrugarh", "Darbhanga", "Gaya", "Bhagalpur", "Kunwar", "Barddhaman", "Jadabpur",
    "Kalyani", "Cuttack", "Barpeta", "Jorhat", "Kharagpur", "Medinipur", "Agartala", "Saranga", "Machilipatnam",
    "Dhanbad", "Silchar", "Dumka", "Kokrajhar", "Bankura", "Jalpaiguri", "Durgapur", "Kalinga", "Palampur", "Jammu",
    "Dwarka", "Faridkot", "Udaipur", "Raigarh", "Hisar", "Solan", "Ajmer", "Lala", "Gurdaspur", "Sultanpur", "Jhansi",
    "Vidisha", "Jagdalpur", "Dipas", "Sawi", "Etawah", "Saharanpur", "Ujjain", "Kangra", "Bhilai", "Rohtak", "Haryana",
    "Ambala", "Bareilly", "Bhoj", "Kapurthala Town", "Sangrur", "Pusa", "Sagar", "Rewa", "Bhawan", "Rampur", "Bhadohi",
    "Cuddalore", "Khopoli", "Bali", "Bhiwandi", "Vasai", "Badlapur", "Sambalpur", "Raurkela", "Brahmapur", "Visnagar",
    "Surendranagar", "Ankleshwar", "Dahanu", "Silvassa", "Jamnagar", "Dhansura", "Muzaffarpur", "Wardha", "Bodhan",
    "Parappanangadi", "Malappuram", "Vizianagaram", "Mavelikara", "Pathanamthitta", "Satara", "Janjgir", "Gold",
    "Himatnagar", "Bodinayakkanur", "Gandhidham", "Mahabalipuram", "Nadiad", "Virar", "Bahadurgarh", "Kaithal",
    "Siliguri", "Tiruppur", "Ernakulam", "Jalandhar", "Barakpur", "Kavaratti", "Ratnagiri", "Moga", "Hansi", "Sonipat",
    "Bandra", "Aizawl", "Itanagar", "Nagar", "Ghatkopar", "Chen", "Powai", "Bhimavaram", "Bhongir", "Medak", "Karimnagar",
    "Narsapur", "Vijayawada", "Markapur", "Mancherial", "Sangli", "Moradabad", "Alipur", "Ichalkaranji", "Devgarh", "Yavatmal",
    "Hinganghat", "Madgaon", "Verna", "Katra", "Bilaspur", "Uttarkashi", "Muktsar", "Bhatinda", "Pathankot", "Khatauli",
    "Vikasnagar", "Kollam", "Kovilpatti", "Kovvur", "Paloncha", "Vasco", "Alwar", "Bijapur", "Tinsukia", "Ratlam", "Kalka",
    "Ladwa", "Rajpura", "Batala", "Hoshiarpur", "Katni", "Bhilwara", "Jhajjar", "Lohaghat", "Mohali", "Dhuri",
    "Thoothukudi", "Sivakasi", "Coonoor", "Shimoga", "Kayamkulam", "Namakkal", "Dharmapuri", "Aluva", "Antapur",
    "Tanuku", "Eluru", "Balasore", "Hingoli", "Quepem", "Assagao", "Betim", "Cuncolim", "Ahmednagar", "Goa", "Caranzalem",
    "Chopda", "Petlad", "Raipur", "Villupuram", "Shoranur", "Dasua", "Gonda", "Yadgir", "Palladam", "Nuzvid", "Kasaragod",
    "Paonta Sahib", "Sarangi", "Anantapur", "Kumar", "Kaul", "Panipat", "Uppal", "Teri", "Tiruvalla", "Jamal", "Chakra",
    "Narasaraopet", "Dharamsala", "Ranjan", "Garhshankar", "Haridwar", "Chinchvad", "Narela", "Aurangabad", "Sion", "Kalamboli",
    "Chittoor", "Wellington", "Nagapattinam", "Karaikal", "Pollachi", "Thenkasi", "Aranmula", "Koni", "Ariyalur", "Ranippettai",
    "Kundan", "Lamba Harisingh", "Surana", "Ghana", "Lanka", "Kataria", "Kotian", "Khan", "Salt Lake City", "Bala", "Vazhakulam",
    "Paravur", "Nabha", "Ongole", "Kaladi", "Jajpur", "Thenali", "Mohala", "Mylapore", "Bank", "Khammam", "Ring", "Maldah", "Kavali",
    "Andheri", "Baddi", "Mahesana", "Nila", "Gannavaram", "Cumbum", "Belapur", "Phagwara", "Rander", "Siuri", "Bulandshahr", "Bilimora", "Guindy", "Pitampura", "Baharampur", "Dadri", "Boisar", "Shiv", "Multi", "Bhadath", "Ulubari", "Palghar", "Puras", "Sikka", "Saha", "Godhra", "Dam Dam", "Ekkattuthangal", "Sahibabad", "Kalol", "Bardoli", "Wai", "Shirgaon", "Nehra", "Mangalagiri", "Latur", "Kottakkal", "Rewari", "Ponnani", "Narayangaon", "Hapur", "Kalpetta", "Khurja", "Ramnagar", "Neral", "Sendhwa", "Talegaon Dabhade", "Kargil", "Manali", "Jalalabad", "Palani", "Sirkazhi", "Krishnagiri", "Hiriyur", "Muzaffarnagar", "Kashipur", "Gampalagudem", "Siruseri", "Manjeri", "Raniganj", "Mahim", "Bhusawal", "Tirur", "Sattur", "Angul", "Puri", "Khurda", "Dharavi", "Ambur", "Vashi", "Arch", "Colaba", "Hosur", "Kota", "Hugli", "Anantnag", "Murshidabad", "Jharsuguda", "Jind", "Neyveli", "Vaniyambadi", "Srikalahasti", "Liluah", "Pali", "Bokaro", "Sidhi", "Asansol", "Darjeeling", "Kohima", "Shahdara", "Chandannagar", "Nadgaon", "Haripad", "Sitapur", "Vapi", "Bambolim", "Baidyabati", "Connaught Place", "Singtam", "Shyamnagar", "Sikar", "Choolai", "Mayapur", "Puruliya", "Habra", "Kanchrapara", "Goregaon", "Tiptur", "Kalpakkam", "Serampore", "Konnagar", "Port Blair", "Canning", "Mahad", "Alibag", "Pimpri", "Panchgani", "Karjat", "Vaikam", "Mhow", "Lakhimpur", "Madhoganj", "Kheri", "Gudivada", "Avanigadda", "Nayagarh", "Bemetara", "Bhatapara", "Ramgarh", "Dhubri", "Goshaingaon", "Bellare", "Puttur", "Narnaul", "Porbandar", "Keshod", "Dhrol", "Kailaras", "Morena", "Deolali", "Banda", "Orai", "Fatehpur", "Mirzapur", "Adilabad", "Pithapuram", "Ramavaram", "Amalapuram", "Champa", "Ambikapur", "Korba", "Pehowa", "Yamunanagar", "Shahabad", "Hamirpur", "Gulbarga", "Sagar", "Bhadravati", "Sirsi", "Honavar", "Siruguppa", "Koppal", "Gargoti", "Kankauli", "Jalna", "Parbhani", "Koraput", "Barpali", "Jaypur", "Banswara", "Tindivanam", "Mettur", "Srirangam", "Deoria", "Basti", "Padrauna", "Budaun", "Bolpur", "Gujrat", "Balurghat", "Binnaguri", "Guruvayur", "Chandauli", "Madikeri", "Piduguralla", "Vinukonda", "Berasia", "Sultans Battery", "Ramanagaram", "Angadipuram", "Mattanur", "Gobichettipalayam", "Banga", "Sibsagar", "Namrup", "North Lakhimpur", "Dhenkanal", "Karanja", "Cheyyar", "Vandavasi", "Arakkonam", "Tiruvannamalai", "Akividu", "Tadepallegudem", "Madanapalle", "Puttur", "Edavanna", "Kodungallur", "Marmagao", "Sanquelim", "Sakri", "Shahdol", "Satna", "Thasra", "Bundi", "Kishangarh", "Firozpur", "Kot Isa Khan", "Barnala", "Sunam", "Pithoragarh", "Jaspur", "Jhargram", "Dimapur", "Churachandpur", "Raxaul", "Motihari", "Munger", "Purnea", "Mannargudi", "Kumbakonam", "Eral", "Nagercoil", "Kanniyakumari", "Ramanathapuram", "Sivaganga", "Rajapalaiyam", "Srivilliputhur", "Suratgarh", "Gohana", "Sirsa", "Fatehabad", "Nurpur", "Chamba", "Khergam", "Dindigul", "Pudukkottai", "Kaimganj", "Tarn Taran", "Khanna", "Irinjalakuda", "Sehore", "Parra", "Dicholi", "Chicalim", "Saligao", "Changanacheri", "Igatpuri", "Sangamner", "Ganganagar", "Kanhangad", "Chidambaram", "Chittur", "Nilambur", "Arvi", "Jalesar", "Kasganj", "Chandausi", "Beawar", "Bharatpur", "Kathua", "Chalisgaon", "Karamsad", "Peranampattu", "Arani", "Payyanur", "Pattambi", "Pattukkottai", "Pakala", "Vikarabad", "Bhatkal", "Rupnarayanpur", "Kulti", "Koch Bihar", "Nongstoin", "Budbud", "Balangir", "Kharar", "Mukerian", "Mansa", "Punalur", "Mandya", "Nandyal", "Dhone", "Candolim", "Aldona", "Solim", "Daman", "Koothanallur", "Sojat", "Alanallur", "Kagal", "Jhunjhunun", "Sirhind", "Kurali", "Khinwara", "Machhiwara", "Talwandi Sabo", "Malpur", "Dhar", "Medarametla", "Pileru", "Yercaud", "Ottappalam", "Alangulam", "Palus", "Chiplun", "Durg", "Damoh", "Ambarnath", "Haveri", "Mundgod", "Mandvi", "Behala", "Fort", "Bela", "Balana", "Odhan", "Mawana", "Firozabad", "Bichpuri", "Almora", "Pauri", "Azamgarh", "Phaphamau", "Nongpoh", "Gangrar", "Jhalawar", "Nathdwara", "Jaisalmer", "Pushkar", "Sirohi", "Baroda", "Ambah", "Ambejogai", "Ambad", "Osmanabad", "Betalbatim", "Gangapur", "Dindori", "Yeola", "Pandharpur", "Neri", "Umred", "Patelguda", "Patancheru", "Singarayakonda", "Peddapuram", "Gadag", "ChikmagalÅ«r", "Chikodi", "Amer", "Chintamani", "Tambaram", "Palayam", "Karamadai", "Omalur", "Kuzhithurai", "Faizabad", "Thirumangalam", "Kodaikanal", "Devipattinam", "Dharapuram", "Rudrapur", "Talcher", "Haldia", "Karsiyang", "Sandur", "Bapatla", "Shamsabad", "Kandi", "Ramapuram", "Anchal", "Trimbak", "Calangute", "Arpora", "Khargone", "Mandla", "Kalan", "Pachmarhi", "Dhamtari", "Kumhari", "Aundh", "Tala", "Tuljapur", "Botad", "Sidhpur", "Sanand", "Nagwa", "Mussoorie", "Vadamadurai", "Sholavandan", "Pochampalli", "Perundurai", "Lalgudi", "Ponneri", "Mount Abu", "Vadner", "Shanti Grama", "Nalagarh", "Pahalgam", "Dinanagar", "Jatani", "Ganga", "Barmer", "Hoshangabad", "Khajuraho Group of Monuments", "Betul", "Sangola", "Tirumala", "Mirza Murad", "Attur", "Budha", "Pala", "Tonk", "Koni", "Rajpur", "Shrigonda", "Hazaribagh", "Nagaur", "Mandapeta", "Nabadwip", "Nandurbar", "Nazira", "Kasia", "Bargarh", "Kollegal", "Shahkot", "Jagraon", "Channapatna", "Madurantakam", "Kamalpur", "Ranaghat", "Mundra", "Mashobra", "Rama", "Chirala", "Bawana", "Dhaka", "Mahal", "Chitradurga", "Mandsaur", "Dewas", "Sachin", "Andra", "Kalkaji Devi", "Pilkhuwa", "Mehra", "Chhachhrauli", "Samastipur", "Bangaon", "Ghatal", "Jayanti", "Belgharia", "Kamat", "Dhariwal", "Morinda", "Kottagudem", "Suriapet", "Mahesh", "Sirwani", "Kanakpura", "Mahajan", "Sodhi", "Chand", "Nagal", "Hong", "Raju", "Tikamgarh", "Parel", "Jaynagar", "Mill", "Khambhat", "Ballabgarh", "Begusarai", "Shahapur", "Banka", "Golaghat", "Palwal", "Kalra", "Chandan", "Maru", "Nanda", "Chopra", "Kasal", "Rana", "Chetan", "Charu", "Arora", "Chhabra", "Bishnupur", "Manu", "Karimganj", "Ellora Caves", "Adwani", "Amreli", "Soni", "Sarwar", "Balu", "Rawal", "Darsi", "Nandigama", "Mathan", "Panchal", "Jha Jha", "Hira", "Manna", "Amal", "Kheda", "Abdul", "Roshan", "Bhandari", "Binavas", "Hari", "Nandi", "Rajapur", "Suman", "Sakri", "Khalapur", "Dangi", "Thiruthani", "Bawan", "Basu", "Kosamba", "Medchal", "Kakdwip", "Kamalpura", "Dogadda", "Charan", "Basirhat", "Nagari", "Kangayam", "Sopara", "Nadia", "Mahulia", "Alipur", "Hamirpur", "Fatehgarh", "Bagh", "Naini", "Karari", "Ajabpur", "Jaunpur", "Iglas", "Pantnagar", "Dwarahat", "Dasna", "Mithapur", "Bali", "Nilokheri", "Kolayat", "Haripur", "Dang", "Chhota Udepur", "Matar", "Sukma", "Guna", "Dona Paula", "Navelim", "Vainguinim", "Curchorem", "Balaghat", "Bhagwan", "Vijapur", "Sinnar", "Mangaon", "Hadadi", "Bobbili", "Yanam", "Udaigiri", "Balanagar", "Kanigiri", "Muddanuru", "Panruti", "Proddatur", "Puliyur", "Perambalur", "Turaiyur", "Tiruchchendur", "Shadnagar", "Markal", "Sultan", "Rayagada", "Kaniyambadi", "Vandalur", "Sangam", "Katoya", "Gudur", "Farakka", "Baramati", "Tohana"];



  constructor(public swalService: SweetAlertService, public element: ElementRef, public storage: LocalStorageService, private us: UserService, private toastyService: ToastyService, private _formBuilder: FormBuilder) {

    this.activeUser = this.storage.retrieve('activeUser');

    // var array = this.activeUser.roles.split(',');

    if(this.activeUser.roles.hasOwnProperty("4")){
        this.role='4';
    }else if(this.activeUser.roles.hasOwnProperty("5")){
        this.role='5';
    }

    if (this.us.maskUser.id == undefined) {
      this.us.getEmployees(this.activeUser.uid).subscribe((res) => {
        this.allCords = res.data;
      });
    } else {
      this.us.getEmployees(this.us.maskUser.id).subscribe((res) => {
        this.allCords = res.data;
      });
    }


  }

  ngDoCheck() {
    this.allCords = this.us.allCords;
  }

  ngOnInit(): any {


    jQuery(".usertable").niceScroll({ cursorwidth: "6px", cursorborder: "1px solid #ccc", cursorcolor: "#ccc", autohidemode: "cursor" });

    this.createForm();

  }

  createForm() {
    this.addUserForm = new FormGroup({});
  }

  openForm() {
    this.updateIn = false;
    this.createForm();
    this.fname = ''; this.lname = ''; this.comail = ''; this.mobile = '';
    this.designation = '';
    this.thoroughfare = ''; this.postal_code = ''; this.spousename = '';
    // jQuery('#myModal').modal('toggle');
    this.ciselect.active=[{text:"Mumbai",id:"Mumbai"}];
    this.addCity="Mumbai";
    this.stselect.active=[{text:"MH|Maharashtra",id:"MH|Maharashtra"}];
    this.addState="MH|Maharashtra";
    this.lgModal.toggle();
  }

  openAutoForm(emp: any) {
    this.updateIn = true;
    this.createAutoForm(emp);
  }

  createAutoForm(emp: any) {

    this.upCord = emp.id;

    this.upCord = emp.id;
    this.maritalstatus = emp.marital_status;

    if (emp.birthday != '') {
      let htmldate: any = emp.birthday;

      var div = document.createElement('div');
      div.innerHTML = htmldate;
      var text = div.textContent || div.innerText || '';

      this.Bdt = new Date(text);
      this.birthDay = this.Bdt.getDate().toString();
      this.birthMonth = (this.Bdt.getMonth() + 1).toString();
      this.birthYear = this.Bdt.getFullYear().toString();
    }
    if (emp.weddate != '' && this.maritalstatus == 'Married') {
      let htmldate: any = emp.weddate;

      var div = document.createElement('div');
      div.innerHTML = htmldate;
      var text = div.textContent || div.innerText || '';

      this.dt = new Date(text);
      this.wedDay = this.dt.getDate().toString();
      this.wedMonth = (this.dt.getMonth() + 1).toString();
      this.wedYear = this.dt.getFullYear().toString();
    }



    this.fname = emp.text;
    this.lname = emp.lname;
    this.comail = emp.co_email;
    this.mobile = emp.mobile_number;
    this.designation = emp.designation;
    this.thoroughfare = emp.address.thoroughfare;
    this.postal_code = emp.address.postal_code;
    this.spousename = emp.spouse_name;

    this.ciselect.active = [{ text: emp.address.locality }];
    this.addCity = emp.address.locality;

    this.coselect.active = [{ text: 'India' }];
    this.addCountry = 'India';

    for (var i = 0; i < this.states.length; i++) {
      var stateShort = this.states[i].split("|");
      var shortcode = stateShort[0];
      if (shortcode == emp.address.administrative_area) {
        this.stselect.active = [{ text: this.states[i] }];
        this.addState = this.states[i];
        break;
      }
    }

    this.ciselect.active = [{ text: emp.address.locality }];
    this.addCity = emp.address.locality;

    this.addUserForm = new FormGroup({});

    // jQuery('#myModal').modal('toggle');
    this.lgModal.toggle();
  }

  conditionalRequired(roles: any) {
    return (control: any): { [s: string]: boolean } => {
      if (roles.selected == '5' && control.value.length) {
        return { required: true };
      } else if (roles.selected != '5' && !control.value.length) {
        return { required: false };
      }
    }
  }

  isPassSame(control: any, pass: string): { [s: string]: boolean } {
    // console.log(control.value);
    // console.log(control.value);
    return { isPassSame: true };
  }

  isEmail(control: any): { [s: string]: boolean } {
    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
      return { invalidMail: true };
    }
  }

  isContact(control: any): { [s: string]: boolean } {
    if (!control.value.match("^[0-9]{1,12}$")) {
      return { invalidContact: true };
    }
  }


  toggleStartDatePicker(): void {
    this.showWedDatePicker = !this.showWedDatePicker;
  }

  toggleBirthDatePicker(): void {
    this.showBirthDatePicker = !this.showBirthDatePicker;
  }




  onAddUserSubmit() {
    let tempUser = this.addUserForm.value;
    //console.log(JSON.stringify(tempUser));

    var stateShort = this.addState.split("|");
    var shortcode = stateShort[0];

    var euid, ename;

    if (this.us.maskUser.id == undefined) {
      euid = this.activeUser.uid;
      ename = this.activeUser.name;
    } else {
      euid = this.us.maskUser.id;
      ename = this.us.maskUser.name;
    }

    this.newCoordinatorForm = {
      title: this.fname,    // Node Title /First Name // Company name/Indiviual name
      type: 'account_user',   // co-ordinator node-type
      uid: euid,				// id of created user
      name: ename,
      field_spouse_name: {
        und: [{ 'value': this.spousename }]
      },
      field_designation: {
        und: [{ 'value': this.designation }]
      },
      field_last_name: {
        'und': [{ 'value': this.lname }]  // indiviual last name
      },
      field_birthday: {
        'und': [
          {
            'value': {
              'day': (this.birthDay.length ? this.birthDay : ''),
              'month': (this.birthMonth.length ? this.birthMonth : ''),
              'year': (this.birthYear.length ? this.birthYear : '')
            }
          }
        ]
      },
      'field_wedding_anniversary_': {
        'und': [
          {
            'value': {
              'day': (this.wedDay.length ? this.wedDay : ''),
              'month': (this.wedMonth.length ? this.wedMonth : ''),
              'year': (this.wedYear.length ? this.wedYear : '')
            }
          }
        ]
      },
      field_mobile_number: {
        'und': [{ 'value': this.mobile }]	// number
      },
      field_email_address: {
        'und': [{ 'value': this.comail }]   // mail id new for co-ordinator
      },
      field_address: {
        'und': [{
          'thoroughfare': this.thoroughfare,  // addressline 1
          'locality': this.addCity,
          'administrative_area': (shortcode.length ? shortcode : ''), // state code
          'postal_code': this.postal_code,   // post code
          'name_line': this.fname + ' ' + this.lname // full name - concat title and last name
        }]
      },
      field_marital_status: {
        'und': [
          this.maritalstatus   // marital status STRING 'Married' 'Unmarried' , 'Other'
        ]
      }
    };

    // console.log(JSON.stringify(this.newCoordinatorForm));

    if (this.updateIn == true) {
      this.addToast('wait', 'Updating Co-ordinator', 'Updating Co-Ordinator account.', 40000);

      this.us.updateCord(this.newCoordinatorForm, this.upCord).subscribe((res) => {

        if (res.status == 200) {
          this.toastyService.clear(this.waitToastID);
          this.addToast('success', 'Success', 'Co-ordinator Updated Successfully', 5000);
          if (this.us.maskUser.id == undefined) {
            this.us.getEmployees(this.activeUser.uid).subscribe((res) => {
              this.allCords = res.data;

            });
          } else {
            this.us.getEmployees(this.us.maskUser.id).subscribe((res) => {
              this.allCords = res.data;
            });
          }
          this.openForm();
        } else {
          this.toastyService.clear(this.waitToastID);
          this.addToast('error', 'Error Occured', JSON.stringify(res.data), 5000);
        }


      });
    } else {
      this.addToast('wait', 'Adding Co-ordinator', 'Creating Co-Ordinator account.', 40000);

      this.us.createCoordinator(this.newCoordinatorForm).subscribe((res) => {

        if (res.success) {
          this.toastyService.clear(this.waitToastID);
          this.addToast('success', 'Success', 'Co-ordinator Added Successfully', 5000);
          if (this.us.maskUser.id == undefined) {
            this.us.getEmployees(this.activeUser.uid).subscribe((res) => {
              this.allCords = res.data;
            });
          } else {
            this.us.getEmployees(this.us.maskUser.id).subscribe((res) => {
              this.allCords = res.data;
            });
          }
          this.openForm();
        } else {
          this.toastyService.clear(this.waitToastID);
          this.addToast('error', 'Error Occured', res.data, 5000);
        }


      });
    }

  }

  public onWeddingChange(value: any): void {
    this.wedDay = value.getDate().toString();
    this.wedMonth = (value.getMonth() + 1).toString();
    this.wedYear = value.getFullYear().toString();
  }

  public onBirthChange(value: any): void {
    this.birthDay = value.getDate().toString();
    this.birthMonth = (value.getMonth() + 1).toString();
    this.birthYear = value.getFullYear().toString();

  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: any): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  public selected(value: any, type: string): void {
    // console.log('Selected value is: ', value);
    if (type == 'state') {
      this.addState = value.text;
    } else if (type == 'city') {
      this.addCity = value.text;
    } else if (type == 'country') {
      this.addCountry = value.text;
    }
  }

  public removed(value: any, type: string): void {
    console.log('Removed value is: ', value);
    if (type == 'state') {
      this.addState = '';
    } else if (type == 'city') {
      this.addCity = '';
    } else if (type == 'country') {
      this.addCountry = '';
    } else if (type == 'country') {
      this.addCountry = value.text;
    }
  }

  public refreshValue(value: any, type: string): void {
    if (type == 'state') {
      this.addState = value.text;
    } else if (type == 'city') {
      this.addCity = value.text;
    } else if (type == 'country') {
      this.addCountry = value.text;
    }
  }

  public refresUsers() {
    this.us.getEmployees(this.activeUser.uid).subscribe((res) => {
      this.allCords = res.data;
    });
  }

  public deleteUser(uid: string) {
    this.addToast('wait', 'Deleting User', 'Thrashing User Data', 30000);
    this.us.deleteCord(uid).subscribe((res) => {
      this.toastyService.clear(this.waitToastID);
      this.refresUsers();
      this.addToast('success', 'Success', 'Co-ordinator Removed Successfully !!!', 8000);
    });
  }



  public addToast(type: any, rtitle: string, message: string, timeout: number) {
    // Just add default Toast with title only
    // Or create the instance of ToastOptions
    var toastOptions: ToastOptions = {
      title: rtitle,
      msg: message,
      showClose: false,
      theme: 'default',
      timeout: timeout,
      onAdd: (toast: ToastData) => {
        // console.log('Toast ' + toast.id + ' has been added!');
        if (type == 'wait') {
          this.waitToastID = toast.id;
        } else if (type == 'success') {
          this.successToastID = toast.id;
        } else if (type == 'error') {
          this.errorToastID = toast.id;
        }

      },
      onRemove: function (toast: ToastData) {
        // console.log('Toast ' + toast.id + ' has been removed!');
        if (type == 'wait') {
          this.waitToastID = null;
        } else if (type == 'success') {
          this.successToastID = null;
        } else if (type == 'error') {
          this.errorToastID = null;
        }
      }
    };

    if (type == 'wait') {
      this.toastyService.wait(toastOptions);
    } else if (type == 'success') {
      this.toastyService.success(toastOptions);
    } else if (type == 'error') {
      this.toastyService.error(toastOptions);
    }
  }

  deleteCord(id: any) {
    this.swalService.swal({
      title: 'Are you sure?',
      text: 'All employee data will be erased !',
      type: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Yes, delete employee !',
      cancelButtonText: 'No, keep it',
    }).then((button) => {
      if (button) {
        this.addToast('wait', 'Deleting Employee', 'Thrashing Employee Data', 30000);
        this.us.deleteCord(id).subscribe((res) => {
          this.toastyService.clear(this.waitToastID);
          if (this.us.maskUser.id == undefined) {
            this.us.getEmployees(this.activeUser.uid).subscribe((res) => {
              this.allCords = res.data;
            });
          } else {
            this.us.getEmployees(this.us.maskUser.id).subscribe((res) => {
              this.allCords = res.data;
            });
          }
          this.addToast('success', 'Success', 'Co-ordinator Removed Successfully !!!', 8000);
        });
      }

    }, (dismiss) => {
    });

  }




}
