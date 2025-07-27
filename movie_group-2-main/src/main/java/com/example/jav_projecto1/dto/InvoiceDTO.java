package com.example.jav_projecto1.dto;

import java.sql.Timestamp;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDTO {
    private Long invoiceId;
    private String movieName;
    private String scheduleShow;
    private String scheduleShowTime;
    private String seat;
    private Integer totalMoney;
    private Timestamp bookingDate;
    private Boolean status;
}