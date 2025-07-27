package com.example.jav_projecto1.controller;
import com.example.jav_projecto1.service.VNPayService;
import com.example.jav_projecto1.service.BookingService;
import com.example.jav_projecto1.entities.Invoice;
import com.example.jav_projecto1.entities.Account;
import com.example.jav_projecto1.respiratory.AccountRespiratory;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;
import java.util.Optional;

@Controller
public class VNPayController {
    @Autowired
    private VNPayService vnPayService;
    @Autowired
    private BookingService bookingService;
    @Autowired
    private AccountRespiratory accountRespiratory;

    @GetMapping("")
    public String home(){
        return "index";
    }

    @PostMapping("/submitOrder")
    public String submidOrder(@RequestParam("amount") int orderTotal,
                              @RequestParam("orderInfo") String orderInfo,
                              HttpServletRequest request){
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        return "redirect:" + vnpayUrl;
    }

    @GetMapping("/vnpay-payment")
    public String GetMapping(HttpServletRequest request, Model model){
        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);

        // Lưu vé vào DB nếu thanh toán thành công (ví dụ: parse orderInfo để lấy thông tin vé)
        if (paymentStatus == 1) {
            // Ví dụ: orderInfo = "movieName - scheduleShow - seat - accountId"
            try {
                String[] parts = orderInfo.split(" - ");
                String movieName = parts[0];
                String scheduleShow = parts[1];
                String seat = parts[2];
                Long accountId = Long.parseLong(parts[3]);
                Optional<Account> accOpt = accountRespiratory.findById(accountId);
                if (accOpt.isPresent()) {
                    Invoice invoice = new Invoice();
                    invoice.setMovieName(movieName);
                    invoice.setScheduleShow(scheduleShow);
                    invoice.setSeat(seat);
                    invoice.setTotalMoney(Integer.parseInt(totalPrice) / 100);
                    invoice.setBookingDate(new Timestamp(System.currentTimeMillis()));
                    invoice.setStatus(true);
                    invoice.setAccount(accOpt.get());
                    bookingService.confirmBooking(invoice, accountId);
                }
            } catch (Exception e) {
                // log lỗi nếu cần
            }
        }

        return paymentStatus == 1 ? "ordersuccess" : "orderfail";
    }
}