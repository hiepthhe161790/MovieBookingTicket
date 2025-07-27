package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    @Query("SELECT i.seat FROM Invoice i WHERE i.movieName = :movieName AND i.scheduleShow = :scheduleShow")
    List<String> findBookedSeats(String movieName, String scheduleShow);

    @Query("SELECT COUNT(i) > 0 FROM Invoice i WHERE i.account.accountId = :accountId AND i.movieName = :movieName")
    boolean hasUserBoughtTicketForMovie(Long accountId, String movieName);
}