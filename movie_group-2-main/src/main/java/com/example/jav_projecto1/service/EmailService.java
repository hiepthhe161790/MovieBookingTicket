package com.example.jav_projecto1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String to, String movieName, String scheduleShow, String seat) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your-email@gmail.com"); // Thay bằng email của bạn
        message.setTo(to);
        message.setSubject("Xác nhận đặt vé thành công");
        message.setText(String.format(
            "Xin chào,\n\n" +
            "Cảm ơn bạn đã đặt vé tại rạp phim của chúng tôi.\n\n" +
            "Thông tin đặt vé:\n" +
            "- Phim: %s\n" +
            "- Suất chiếu: %s\n" +
            "- Ghế: %s\n\n" +
            "Chúc bạn xem phim vui vẻ!\n\n" +
            "Trân trọng,\n" +
            "Rạp phim của bạn",
            movieName, scheduleShow, seat
        ));

        mailSender.send(message);
    }
}