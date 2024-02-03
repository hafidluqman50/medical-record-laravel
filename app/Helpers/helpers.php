<?php 

function format_rupiah(string $money): string 
{
    $hasil_rupiah = 'Rp. ' . number_format($money,2,',','.');
    return $hasil_rupiah;
}