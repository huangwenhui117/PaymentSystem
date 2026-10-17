package com.example.demo.Entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.demo.Object.PaymentStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {

	@Id
	private String id;

	private String name;
	private String email;
	private String initials;
	private String color;
	private String description;
	private LocalDateTime date;
	private BigDecimal amount;

	@Enumerated(EnumType.STRING)
	private PaymentStatus status;

	protected Payment() {
	}

	public Payment(String id, String name, String email, String initials, String color, String description,
			LocalDateTime date, BigDecimal amount, PaymentStatus status) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.initials = initials;
		this.color = color;
		this.description = description;
		this.date = date;
		this.amount = amount;
		this.status = status;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}

	public String getInitials() {
		return initials;
	}

	public String getColor() {
		return color;
	}

	public String getDescription() {
		return description;
	}

	public LocalDateTime getDate() {
		return date;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public PaymentStatus getStatus() {
		return status;
	}
}
