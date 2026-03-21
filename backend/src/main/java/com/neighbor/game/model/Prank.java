package com.neighbor.game.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "prank")
public class Prank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id")
    private Level level;

    private String name;

    private String description;

    @Column(name = "object_name")
    private String objectName;

    @Column(name = "pos_x")
    private int posX;

    @Column(name = "pos_y")
    private int posY;

    @Column(name = "anger_points")
    private int angerPoints;

    @Column(name = "success_chance")
    private double successChance;

    @ManyToMany
    @JoinTable(
        name = "prank_dependency",
        joinColumns = @JoinColumn(name = "prank_id"),
        inverseJoinColumns = @JoinColumn(name = "required_prank_id")
    )
    private Set<Prank> requiredPranks;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Level getLevel() { return level; }
    public void setLevel(Level level) { this.level = level; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getObjectName() { return objectName; }
    public void setObjectName(String objectName) { this.objectName = objectName; }
    public int getPosX() { return posX; }
    public void setPosX(int posX) { this.posX = posX; }
    public int getPosY() { return posY; }
    public void setPosY(int posY) { this.posY = posY; }
    public int getAngerPoints() { return angerPoints; }
    public void setAngerPoints(int angerPoints) { this.angerPoints = angerPoints; }
    public double getSuccessChance() { return successChance; }
    public void setSuccessChance(double successChance) { this.successChance = successChance; }
    public Set<Prank> getRequiredPranks() { return requiredPranks; }
    public void setRequiredPranks(Set<Prank> requiredPranks) { this.requiredPranks = requiredPranks; }
}
