<?php 

function format_rupiah(string $money): string 
{
    $hasil_rupiah = 'Rp. ' . number_format($money,2,',','.');
    return $hasil_rupiah;
}

function tambah_hari(string $date): string {
    $tiga_hari = date('Y-m-d', strtotime('+3 days', strtotime($date)));
    return $tiga_hari;
}

function human_date(string|null $date): string {
    if($date != null && $date != '0000-00-00') {
        $explode = explode('-',$date);
        return $explode[2].' '.month($explode[1]).' '.$explode[0];
    }
    else {
        return '-';
    }
}

function month(string $month): string {
    $array = [
        '01' => 'Januari',
        '02' => 'Februari',
        '03' => 'Maret',
        '04' => 'April',
        '05' => 'Mei',
        '06' => 'Juni',
        '07' => 'Juli',
        '08' => 'Agustus',
        '09' => 'September',
        '10' => 'Oktober',
        '11' => 'November',
        '12' => 'Desember'
    ];
    return $array[$month];
}