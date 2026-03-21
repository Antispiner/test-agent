package com.neighbor.game.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "level")
public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Column(name = "order_index")
    private int orderIndex;

    @Column(name = "max_anger")
    private int maxAnger;

    @OneToMany(mappedBy = "level", fetch = FetchType.LAZY)
    private List<Prank> pranks;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
    public int getMaxAnger() { return maxAnger; }
    public void setMaxAnger(int maxAnger) { this.maxAnger = maxAnger; }
    public List<Prank> getPranks() { return pranks; }
    public void setPranks(List<Prank> pranks) { this.pranks = pranks; }
}
