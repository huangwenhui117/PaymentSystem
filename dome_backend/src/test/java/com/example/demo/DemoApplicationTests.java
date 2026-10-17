package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.demo.Entity.Payment;
import com.example.demo.Mapper.CreatePaymentRequest;
import com.example.demo.Object.PaymentStatus;
import com.example.demo.Repository.PaymentRepository;
import com.example.demo.Service.PaymentService;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:payments-test;DB_CLOSE_DELAY=-1",
		"spring.jpa.hibernate.ddl-auto=create-drop"
})
class DemoApplicationTests {

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private PaymentService paymentService;

	@Test
	void contextLoads() {
	}

	// @Test
	// void loadsSeedTransactionsWithDatesFromDatabase() {
	// 	var payments = paymentService.getPayments();

	// 	assertFalse(payments.isEmpty());
	// 	assertEquals("PY-84291", payments.get(0).getId());
	// 	assertEquals("Olivia Rhye", paymentRepository.findById("PY-84291").orElseThrow().getName());
	// }

	// @Test
	// void savesNewTransactionsInDatabase() {
	// 	Payment payment = paymentService.createPayment(
	// 			new CreatePaymentRequest("Alex Morgan", "alex@example.com", "Invoice #1049", new BigDecimal("42.50")));

	// 	assertEquals("Alex Morgan", paymentRepository.findById(payment.getId()).orElseThrow().getName());
	// 	assertEquals(PaymentStatus.Pending, payment.getStatus());
	// 	assertEquals(new BigDecimal("42.50"), payment.getAmount());
	// }
}
