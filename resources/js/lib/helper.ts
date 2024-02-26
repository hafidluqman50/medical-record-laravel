const encodeHtmlEntities = (text: string): string => {
    return text.replace(/[\u00A0-\u9999<>\&]/g, i => '&#'+i.charCodeAt(0)+';')
}

const dateWithSlash = (date:Date): string => {
    const result = new Date(date)

    let month:number|string = result.getMonth()+1;
    month = `0${month}`.slice(-2);

    let newDate:number|string  = result.getDate();
    newDate = `0${newDate}`.slice(-2);

    return `${result.getFullYear()}/${month}/${newDate}`
}

const formatRupiah = (number: number|bigint): string => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits:0 }).format(number)
}
const pembilang = (nilai: number): string => {
  nilai = Math.floor(Math.abs(nilai));
 
  var simpanNilaiBagi = 0;
  var huruf = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];
  var temp = '';
 
  if (nilai < 12) {
    temp = ' ' + huruf[nilai];
  } else if (nilai < 20) {
    temp = pembilang(Math.floor(nilai - 10)) + ' Belas';
  } else if (nilai < 100) {
    simpanNilaiBagi = Math.floor(nilai / 10);
    temp = pembilang(simpanNilaiBagi) + ' Puluh' + pembilang(nilai % 10);
  } else if (nilai < 200) {
    temp = ' Seratus' + pembilang(nilai - 100);
  } else if (nilai < 1000) {
    simpanNilaiBagi = Math.floor(nilai / 100);
    temp = pembilang(simpanNilaiBagi) + ' Ratus' + pembilang(nilai % 100);
  } else if (nilai < 2000) {
    temp = ' Seribu' + pembilang(nilai - 1000);
  } else if (nilai < 1000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000);
    temp = pembilang(simpanNilaiBagi) + ' Ribu' + pembilang(nilai % 1000);
  } else if (nilai < 1000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000);
    temp = pembilang(simpanNilaiBagi) + ' Juta' + pembilang(nilai % 1000000);
  } else if (nilai < 1000000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000000);
    temp =
      pembilang(simpanNilaiBagi) + ' Miliar' + pembilang(nilai % 1000000000);
  } else if (nilai < 1000000000000000) {
    simpanNilaiBagi = Math.floor(nilai / 1000000000000);
    temp = pembilang(nilai / 1000000000000) + ' Triliun' + pembilang(nilai % 1000000000000);
  }
 
  return temp;
}
 

export {
    encodeHtmlEntities,
    formatRupiah,
    pembilang,
    dateWithSlash
}