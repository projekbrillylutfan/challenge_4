class Car {
    private cars: CarData[];
  
    constructor(cars: CarData[]) {
      this.cars = cars;
    }
  
    filterCarAvailable(): CarData[] {
      return this.cars.filter((car) => car.available === true);
    }
  
    filterCarUnAvailable(): CarData[] {
      return this.cars.filter((car) => car.available === false);
    }
  
    filterCarByUser(): CarData[] | void {
      const driver = (document.getElementById("driver") as HTMLInputElement).value;
      const date = (document.getElementById("date") as HTMLInputElement).value;
      const time = (document.getElementById("time") as HTMLInputElement).value;
      const dateTime = date + time;
      const passanger = (document.getElementById("passanger") as HTMLInputElement).value;
  
      if (driver === undefined || driver === "") {
        alert("Silahkan Pilih Tipe Driver Terlebih Dahulu");
        return;
      }
  
      if (dateTime < getDateTimeNow()) {
        alert("Pilih tanggal dan waktu yang lebih besar dari sekarang");
        return;
      }
  
      if (passanger == "" && driver.toString() == "true") {
        return this.cars.filter((car) => car.available === true && car.availableAt <= dateTime);
      } else if (passanger != "" && driver.toString() == "true") {
        return this.cars.filter(
          (car) => car.available === true && car.capacity >= parseInt(passanger) && car.availableAt <= dateTime
        );
      } else if (passanger == "" && driver.toString() == "false") {
        return this.cars.filter((car) => car.available === false && car.availableAt <= dateTime);
      } else if (passanger != "" && driver.toString() == "false") {
        return this.cars.filter(
          (car) => car.available === false && car.capacity >= parseInt(passanger) && car.availableAt <= dateTime
        );
      }
    }
  }
  
  interface CarData {
    id: number;
    name: string;
    available: boolean;
    // Add other properties here
  }
  
  function getDateTimeNow(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}`;
  }
  
  // You can update the 'CarData' interface to match your actual data structure.
// Module Request
const xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", "http://localhost:8080/api/cars", false);
xmlHttp.send(null); // Request body null

// Get Data from JSON
const data: CarData[] = JSON.parse(xmlHttp.responseText);

// Filter Car by Available
const cars = new Car(data);

// Get Element by ID carsList
const app = document.getElementById("carsList");
let htmlData = "";

// Function Format Rupiah
function rupiah(number: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
}

// Trigger Function by Button id=btnFilterCar
const btnFilterCar = document.getElementById("btnFilterCar") as HTMLButtonElement;
btnFilterCar.addEventListener("click", getCars);

// Loop Data
function getCars() {
  htmlData = "";
  const filteredData = cars.filterCarByUser();
  if (filteredData === undefined || filteredData.length === 0) {
    htmlData = "";
    if (app) {
      app.innerHTML = htmlData;
    }
    return;
  } else {
    for (let index = 0; index < filteredData.length; index++) {
      const car = filteredData[index];
      const rentCost = rupiah(car.rentPerDay);
      htmlData += `
        <div style="width: 333px; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; height: fit-content; margin-bottom: 35px;">
          <img src="${car.image}" alt="${car.manufacture}" style="width: 100%; height: 222px; border-radius: 3px;">
          <p style="margin: 16px 0px 8px 0px; font-family: 'Helvetica'; font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px;">${car.manufacture} ${car.model}</p>
          <h5 style="margin-bottom: 8px; font-family: 'Helvetica'; font-style: normal; font-weight: 700; font-size: 16px; line-height: 24px;">${rentCost} / hari</h5>
          <h6 style="height: 60px; margin-bottom: 16px; font-family: 'Helvetica'; font-style: normal; font-weight: 300; font-size: 14px; line-height: 20px;">${car.description}</h6>
          <div style="display: flex; ">
            <div style="margin-right: 8px; padding: 0px;"> 
              <i class="bi bi-people" aria-hidden="true" style="font-size:24px;"></i>
            </div> 
            <p style="font-family: 'Helvetica'; font-style: normal; font-weight: 300; font-size: 14px; line-height: 26px;">
            ${car.capacity} Orang
            </p>
          </div>
          <div style="display: flex; ">
            <div style="margin-right: 12px; padding: 2px 0px;"> 
              <i class="bi bi-gear" aria-hidden="true" style="font-size:20px;"></i>
            </div> 
            <p style="font-family: 'Helvetica'; font-style: normal; font-weight: 300; font-size: 14px; line-height: 26px;">
            ${car.transmission}
            </p>
          </div>
          <div style="display: flex;">
            <div style="margin-right: 12px; padding: 2px 0px;"> 
              <i class="bi bi-calendar4" aria-hidden="true" style="font-size:20px;"></i>
            </div> 
            <p style="font-family: 'Helvetica'; font-style: normal; font-weight: 300; font-size: 14px; line-height: 26px;">
            ${car.year}
            </p>
          </div>
          <button style="margin-top:8px; width: 100%; padding: 14px 0px; background: #5CB85F; border-radius: 3px; border: none; color: white; text-align: center; text-decoration: none; font-family: 'Helvetica';
          font-style: normal;
          font-weight: 700;
          font-size: 14px; font-family: 'Helvetica'; line-height: 20px;">
            Pilih Mobil
          </button>
        </div>
      `;
    }
    if (app) {
      app.innerHTML = htmlData;
    }
    if (htmlData == "") {
      alert("Tidak ada mobil yang tersedia");
    }
  }
}
