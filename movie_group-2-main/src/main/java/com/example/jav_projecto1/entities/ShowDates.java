package com.example.jav_projecto1.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowDates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer showDateId;

    private Date showDate;
    private String dateName;
}