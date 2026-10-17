package com.example.demo.DB;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.Entity.Payment;
import com.example.demo.Object.PaymentStatus;
import com.example.demo.Repository.PaymentRepository;

@Component
public class PaymentDataInitializer implements CommandLineRunner {

	private final PaymentRepository paymentRepository;

	public PaymentDataInitializer(PaymentRepository paymentRepository) {
		this.paymentRepository = paymentRepository;
	}

	@Override
	public void run(String... args) {
		if (paymentRepository.count() > 0) {
			return;
		}

		LocalDate today = LocalDate.now();
		paymentRepository.saveAll(List.of(
				payment("PY-84291", "Olivia Rhye", "olivia@lanecollective.co", "OR", "lilac",
						"Lane Collective · Invoice #1048", today, 10, 42, "2450", PaymentStatus.Completed),
				payment("PY-84290", "Phoenix Baker", "phoenix@bakerstudio.com", "PB", "peach",
						"Baker Studio · Monthly plan", today, 9, 18, "890", PaymentStatus.Pending),
				payment("PY-84289", "Lana Steiner", "lana@wildflower.io", "LS", "mint",
						"Wildflower · Invoice #1046", today, 8, 3, "1250", PaymentStatus.Completed),
				payment("PY-84288", "Demi Wilkinson", "demi@frameworks.design", "DW", "blue",
						"Frameworks · Design retainer", today.minusDays(1), 16, 36, "3200", PaymentStatus.Failed),
				payment("PY-84287", "Candice Wu", "candice@northstar.shop", "CW", "rose",
						"Northstar · Order #NS-3921", today.minusDays(1), 14, 11, "168", PaymentStatus.Completed),
				payment("PY-84286", "Natali Craig", "natali@orbitandco.com", "NC", "gold",
						"Orbit & Co. · Invoice #1043", today.minusDays(1), 11, 25, "760", PaymentStatus.Completed)));
	}

	private Payment payment(String id, String name, String email, String initials, String color,
			String description, LocalDate date, int hour, int minute, String amount, PaymentStatus status) {
		return new Payment(id, name, email, initials, color, description,
				LocalDateTime.of(date, LocalTime.of(hour, minute)), new BigDecimal(amount), status);
	}
}
